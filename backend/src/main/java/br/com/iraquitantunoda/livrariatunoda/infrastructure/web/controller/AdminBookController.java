package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookMetricsResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.BookResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ChangeStatusRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CreateBookRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.UpdateBookRequest;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.ChangeBookStatusUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreateBookUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetBookMetricsUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.UpdateBookUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final CreateBookUseCase createBookUseCase;
    private final UpdateBookUseCase updateBookUseCase;
    private final ChangeBookStatusUseCase changeBookStatusUseCase;
    private final GetBookMetricsUseCase getBookMetricsUseCase;

    @PostMapping
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody CreateBookRequest request) {
        var response = createBookUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<BookResponse> updateBook(
        @PathVariable String bookId,
        @Valid @RequestBody UpdateBookRequest request
    ) {
        var response = updateBookUseCase.execute(bookId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{bookId}/status")
    public ResponseEntity<BookResponse> changeBookStatus(
        @PathVariable String bookId,
        @Valid @RequestBody ChangeStatusRequest request
    ) {
        var response = changeBookStatusUseCase.execute(bookId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{bookId}/metrics")
    public ResponseEntity<BookMetricsResponse> getBookMetrics(@PathVariable String bookId) {
        var response = getBookMetricsUseCase.execute(bookId);
        return ResponseEntity.ok(response);
    }
}

