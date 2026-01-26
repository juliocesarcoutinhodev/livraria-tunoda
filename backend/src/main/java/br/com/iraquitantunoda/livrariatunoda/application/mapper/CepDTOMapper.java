package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CepResponse;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.dto.CnpjaZipApiResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CepDTOMapper {

    @Mapping(target = "atualizadoEm", source = "updated")
    @Mapping(target = "cep", source = "code")
    @Mapping(target = "codigoMunicipio", source = "municipality")
    @Mapping(target = "logradouro", source = "street")
    @Mapping(target = "numero", source = "number")
    @Mapping(target = "bairro", source = "district")
    @Mapping(target = "cidade", source = "city")
    @Mapping(target = "uf", source = "state")
    CepResponse toResponse(CnpjaZipApiResponse response);
}
