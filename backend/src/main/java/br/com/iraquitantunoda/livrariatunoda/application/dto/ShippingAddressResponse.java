package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record ShippingAddressResponse(
    String street,
    String number,
    String complement,
    String neighborhood,
    String city,
    String state,
    String postalCode
) {
}
