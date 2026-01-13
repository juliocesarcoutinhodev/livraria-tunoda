package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import br.com.iraquitantunoda.livrariatunoda.domain.model.PaymentId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.PaymentMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.PaymentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PaymentRepositoryAdapter implements PaymentRepository {

    private final PaymentJpaRepository jpaRepository;
    private final PaymentMapper mapper;

    @Override
    public Payment save(Payment payment) {
        var entity = jpaRepository.findById(payment.getId().getValue())
                .orElse(mapper.toEntity(payment));

        mapper.updateEntity(entity, payment);
        var saved = jpaRepository.save(entity);
        jpaRepository.flush();
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Payment> findById(PaymentId id) {
        return jpaRepository.findById(id.getValue())
                .map(mapper::toDomain);
    }

    @Override
    public List<Payment> findByOrderId(OrderId orderId) {
        return jpaRepository.findAllByOrderId(orderId.getValue())
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Payment> findByExternalReference(String externalReference) {
        return jpaRepository.findByExternalReference(externalReference)
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsByOrderIdAndStatus(OrderId orderId, PaymentStatus status) {
        return jpaRepository.existsByOrderIdAndStatus(orderId.getValue(), status);
    }
}

