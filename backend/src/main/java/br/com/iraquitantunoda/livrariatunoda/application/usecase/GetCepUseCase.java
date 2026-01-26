package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CepResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.CepDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.CnpjaClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetCepUseCase {

    private final CnpjaClient cnpjaClient;
    private final CepDTOMapper mapper;

    @Transactional(readOnly = true)
    public CepResponse execute(String cep) {
        var normalized = normalizeCep(cep);
        var response = cnpjaClient.fetchZip(normalized);
        if (response == null) {
            throw new ResourceNotFoundException("CEP não encontrado");
        }
        return mapper.toResponse(response);
    }

    private String normalizeCep(String cep) {
        if (cep == null) {
            throw new BusinessException("CEP inválido");
        }
        var normalized = cep.replaceAll("\\D", "");
        if (normalized.length() != 8) {
            throw new BusinessException("CEP inválido");
        }
        return normalized;
    }
}
