package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ChangeStatusRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CreateAuthorRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.UpdateAuthorRequest;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.ChangeAuthorStatusUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreateAuthorUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.UpdateAuthorUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/authors")
@RequiredArgsConstructor
public class AdminAuthorController {

    private final CreateAuthorUseCase createAuthorUseCase;
    private final UpdateAuthorUseCase updateAuthorUseCase;
    private final ChangeAuthorStatusUseCase changeAuthorStatusUseCase;

    @PostMapping
    public ResponseEntity<AuthorResponse> createAuthor(@Valid @RequestBody CreateAuthorRequest request) {
        var response = createAuthorUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{authorId}")
    public ResponseEntity<AuthorResponse> updateAuthor(
        @PathVariable String authorId,
        @Valid @RequestBody UpdateAuthorRequest request
    ) {
        var response = updateAuthorUseCase.execute(authorId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{authorId}/status")
    public ResponseEntity<AuthorResponse> changeAuthorStatus(
        @PathVariable String authorId,
        @Valid @RequestBody ChangeStatusRequest request
    ) {
        var response = changeAuthorStatusUseCase.execute(authorId, request);
        return ResponseEntity.ok(response);
    }
}

