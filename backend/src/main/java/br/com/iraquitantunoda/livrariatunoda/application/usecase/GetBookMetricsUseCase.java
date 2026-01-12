package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookMetricsResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetBookMetricsUseCase {

    private final BookRepository bookRepository;
    private final BookMetricRepository bookMetricRepository;

    @Transactional(readOnly = true)
    public BookMetricsResponse execute(String bookId) {
        var bookIdTyped = BookId.of(bookId);

        var book = bookRepository.findById(bookIdTyped)
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

        log.debug("Consultando métricas do livro: id={}, status={}", bookId, book.getStatus());

        var metrics = bookMetricRepository.countByBookIdGroupedByEventType(bookIdTyped);

        var views = metrics.getOrDefault(EventType.VIEW, 0L);
        var clicks = metrics.getOrDefault(EventType.CLICK, 0L);

        log.debug("Métricas encontradas: bookId={}, views={}, clicks={}", bookId, views, clicks);

        return new BookMetricsResponse(bookId, views, clicks);
    }
}

