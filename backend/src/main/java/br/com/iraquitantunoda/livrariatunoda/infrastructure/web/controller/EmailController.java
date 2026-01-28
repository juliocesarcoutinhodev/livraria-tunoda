package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.SendTestEmailRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.SendTestEmailResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.SendTestEmailUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/emails")
@RequiredArgsConstructor
public class EmailController {

    private final SendTestEmailUseCase sendTestEmailUseCase;

    @PostMapping("/test")
    public ResponseEntity<SendTestEmailResponse> sendTestEmail(@Valid @RequestBody SendTestEmailRequest request) {
        var response = sendTestEmailUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
