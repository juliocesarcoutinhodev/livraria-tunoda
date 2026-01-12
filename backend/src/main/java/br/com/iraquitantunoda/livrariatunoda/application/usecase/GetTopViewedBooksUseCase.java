package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.TopBookMetricDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.TopBooksResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetTopViewedBooksUseCase {

    private final BookMetricRepository bookMetricRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public TopBooksResponse execute(int limit) {
        log.debug("Buscando top {} livros mais visualizados", limit);

        var topBooks = bookMetricRepository.findTopBooksByEventType(EventType.VIEW, limit);

        var result = new ArrayList<TopBookMetricDTO>();

        for (var summary : topBooks) {
            var bookId = BookId.of(summary.getBookId());
            var bookOpt = bookRepository.findById(bookId);

            if (bookOpt.isPresent() && bookOpt.get().isActive()) {
                var book = bookOpt.get();
                result.add(new TopBookMetricDTO(
                    book.getId().getValue(),
                    book.getTitle(),
                    book.getPhotoUrl(),
                    summary.getTotalMetrics()
                ));
            }
        }

        log.debug("Encontrados {} livros ativos com visualizações", result.size());

        return new TopBooksResponse(result, LocalDateTime.now());
    }
}

