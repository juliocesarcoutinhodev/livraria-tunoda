package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.dto;

public record CnpjaZipApiResponse(
    String updated,
    String code,
    Integer municipality,
    String street,
    String number,
    String district,
    String city,
    String state
) {
}
