package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.PaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentDTOMapper {

    @Mapping(target = "paymentId", source = "id.value")
    @Mapping(target = "orderId", source = "orderId.value")
    @Mapping(target = "amount", source = "amount.amount")
    @Mapping(target = "currency", source = "amount.currency")
    @Mapping(target = "method", source = "method")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "gateway", source = "gateway")
    @Mapping(target = "externalReference", source = "externalReference")
    @Mapping(target = "rejectionReason", source = "rejectionReason")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    PaymentResponse toResponse(Payment payment);
}

