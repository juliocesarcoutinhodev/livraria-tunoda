package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CepResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetCepUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/cep")
@RequiredArgsConstructor
public class CepController {

    private final GetCepUseCase getCepUseCase;

    @GetMapping("/{cep}")
    public ResponseEntity<CepResponse> getAddress(@PathVariable String cep) {
        var response = getCepUseCase.execute(cep);
        return ResponseEntity.ok(response);
    }
}
