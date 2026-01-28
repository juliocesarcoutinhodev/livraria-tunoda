package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

/**
 * Value Object para endereco de entrega.
 */
@Value
public class ShippingAddress {
    String street;
    String number;
    String complement;
    String neighborhood;
    String city;
    String state;
    String postalCode;

    private ShippingAddress(String street, String number, String complement, String neighborhood,
                            String city, String state, String postalCode) {
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
    }

    public static ShippingAddress create(String street, String number, String complement,
                                         String neighborhood, String city, String state, String postalCode) {
        validateRequired(street, "Rua");
        validateRequired(number, "Numero");
        validateRequired(neighborhood, "Bairro");
        validateRequired(city, "Cidade");
        validateRequired(state, "Estado");
        validateRequired(postalCode, "CEP");

        return new ShippingAddress(
            street.trim(),
            number.trim(),
            complement != null ? complement.trim() : null,
            neighborhood.trim(),
            city.trim(),
            state.trim(),
            postalCode.trim()
        );
    }

    private static void validateRequired(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new BusinessException(fieldName + " do endereco e obrigatorio");
        }
    }
}
