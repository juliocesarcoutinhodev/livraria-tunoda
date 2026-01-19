package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookCatalogResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.BookDetailResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.TopBooksResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetBookDetailUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetTopClickedBooksUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetTopViewedBooksUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.ListActiveBooksUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RecordBookMetricUseCase;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/books")
@RequiredArgsConstructor
public class PublicBookController {

    private final ListActiveBooksUseCase listActiveBooksUseCase;
    private final GetBookDetailUseCase getBookDetailUseCase;
    private final RecordBookMetricUseCase recordBookMetricUseCase;
    private final GetTopViewedBooksUseCase getTopViewedBooksUseCase;
    private final GetTopClickedBooksUseCase getTopClickedBooksUseCase;

    @GetMapping
    public ResponseEntity<PageResponse<BookCatalogResponse>> listActiveBooks(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String title
    ) {
        var response = listActiveBooksUseCase.execute(page, size, title);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookDetailResponse> getBookDetail(@PathVariable String bookId) {
        var response = getBookDetailUseCase.execute(bookId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{bookId}/metrics/view")
    public ResponseEntity<Void> recordView(@PathVariable String bookId) {
        recordBookMetricUseCase.execute(bookId, EventType.VIEW);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/{bookId}/metrics/click")
    public ResponseEntity<Void> recordClick(@PathVariable String bookId) {
        recordBookMetricUseCase.execute(bookId, EventType.CLICK);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<TopBooksResponse> getMostViewedBooks(
        @RequestParam(defaultValue = "10") int limit
    ) {
        var response = getTopViewedBooksUseCase.execute(limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/most-clicked")
    public ResponseEntity<TopBooksResponse> getMostClickedBooks(
        @RequestParam(defaultValue = "10") int limit
    ) {
        var response = getTopClickedBooksUseCase.execute(limit);
        return ResponseEntity.ok(response);
    }
}
