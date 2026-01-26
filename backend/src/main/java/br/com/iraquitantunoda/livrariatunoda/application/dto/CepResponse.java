package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record CepResponse(
    String atualizadoEm,
    String cep,
    Integer codigoMunicipio,
    String logradouro,
    String numero,
    String bairro,
    String cidade,
    String uf
) {
}
