package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetric;
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
public class RecordBookMetricUseCase {

    private final BookRepository bookRepository;
    private final BookMetricRepository bookMetricRepository;

    @Transactional
    public void execute(String bookId, EventType eventType) {
        try {
            var book = bookRepository.findById(BookId.of(bookId))
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

            if (!book.isActive()) {
                log.warn("Tentativa de registrar métrica para livro inativo: {}", bookId);
                return;
            }

            var metric = BookMetric.record(BookId.of(bookId), eventType);
            bookMetricRepository.save(metric);

            log.debug("Métrica registrada: book={}, event={}", bookId, eventType);

        } catch (Exception e) {
            log.error("Erro ao registrar métrica: book={}, event={}, error={}",
                bookId, eventType, e.getMessage());
        }
    }
}

