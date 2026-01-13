package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import br.com.iraquitantunoda.livrariatunoda.domain.model.PaymentId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentStatus;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository {

    Payment save(Payment payment);

    Optional<Payment> findById(PaymentId id);

    List<Payment> findByOrderId(OrderId orderId);

    Optional<Payment> findByExternalReference(String externalReference);

    boolean existsByOrderIdAndStatus(OrderId orderId, PaymentStatus status);
}

