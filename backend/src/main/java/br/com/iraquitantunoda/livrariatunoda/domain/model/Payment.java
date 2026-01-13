package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentMethod;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentStatus;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Payment {

    @EqualsAndHashCode.Include
    private final PaymentId id;
    private final OrderId orderId;
    private final Money amount;
    private final PaymentMethod method;
    private final PaymentGateway gateway;
    private final LocalDateTime createdAt;
    private PaymentStatus status;
    private String externalReference;
    private String rejectionReason;
    private LocalDateTime updatedAt;

    private Payment(PaymentId id, OrderId orderId, Money amount, PaymentMethod method, PaymentGateway gateway,
                    LocalDateTime createdAt, PaymentStatus status, String externalReference, String rejectionReason,
                    LocalDateTime updatedAt) {
        validateOrderId(orderId);
        validateAmount(amount);
        validateMethod(method);
        validateGateway(gateway);

        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
        this.gateway = gateway;
        this.createdAt = createdAt;
        this.status = status;
        this.externalReference = externalReference;
        this.rejectionReason = rejectionReason;
        this.updatedAt = updatedAt;
    }

    public static Payment create(OrderId orderId, Money amount, PaymentMethod method, PaymentGateway gateway) {
        var now = LocalDateTime.now();
        return new Payment(
                PaymentId.generate(),
                orderId,
                amount,
                method,
                gateway,
                now,
                PaymentStatus.CREATED,
                null,
                null,
                now
        );
    }

    public static Payment create(Order order, PaymentMethod method, PaymentGateway gateway) {
        if (order == null) {
            throw new BusinessException("Pedido não pode ser nulo");
        }

        validateAmountMatchesOrderTotal(order.getTotal(), order.getTotal());

        var now = LocalDateTime.now();
        return new Payment(
                PaymentId.generate(),
                order.getId(),
                order.getTotal(),
                method,
                gateway,
                now,
                PaymentStatus.CREATED,
                null,
                null,
                now
        );
    }

    private static void validateAmountMatchesOrderTotal(Money paymentAmount, Money orderTotal) {
        if (!paymentAmount.getAmount().equals(orderTotal.getAmount()) ||
            !paymentAmount.getCurrency().equals(orderTotal.getCurrency())) {
            throw new BusinessException(
                String.format("Valor do pagamento (%s %s) deve ser igual ao total do pedido (%s %s)",
                    paymentAmount.getAmount(),
                    paymentAmount.getCurrency(),
                    orderTotal.getAmount(),
                    orderTotal.getCurrency())
            );
        }
    }

    public static Payment reconstitute(PaymentId id, OrderId orderId, Money amount, PaymentMethod method,
                                      PaymentGateway gateway, LocalDateTime createdAt, PaymentStatus status,
                                      String externalReference, String rejectionReason, LocalDateTime updatedAt) {
        return new Payment(id, orderId, amount, method, gateway, createdAt, status, externalReference, rejectionReason, updatedAt);
    }

    public void associateExternalReference(String reference) {
        if (reference == null || reference.isBlank()) {
            throw new BusinessException("Referência externa não pode ser nula ou vazia");
        }
        if (this.externalReference != null) {
            throw new BusinessException("Referência externa já foi associada e não pode ser alterada");
        }
        this.externalReference = reference;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsPending() {
        if (status != PaymentStatus.CREATED) {
            throw new BusinessException("Apenas pagamentos criados podem ser marcados como pendentes");
        }
        this.status = PaymentStatus.PENDING;
        this.updatedAt = LocalDateTime.now();
    }

    public void approve() {
        if (status == PaymentStatus.APPROVED) {
            throw new BusinessException("Pagamento já está aprovado");
        }
        if (status == PaymentStatus.CANCELLED) {
            throw new BusinessException("Pagamento cancelado não pode ser aprovado");
        }
        if (status == PaymentStatus.EXPIRED) {
            throw new BusinessException("Pagamento expirado não pode ser aprovado");
        }
        if (status != PaymentStatus.PENDING && status != PaymentStatus.CREATED) {
            throw new BusinessException("Apenas pagamentos pendentes ou criados podem ser aprovados");
        }
        this.status = PaymentStatus.APPROVED;
        this.updatedAt = LocalDateTime.now();
    }

    public void reject(String reason) {
        if (reason == null || reason.isBlank()) {
            throw new BusinessException("Motivo da rejeição é obrigatório");
        }
        if (status == PaymentStatus.APPROVED) {
            throw new BusinessException("Pagamento aprovado não pode ser rejeitado");
        }
        if (status == PaymentStatus.REJECTED) {
            throw new BusinessException("Pagamento já está rejeitado");
        }
        if (status == PaymentStatus.CANCELLED) {
            throw new BusinessException("Pagamento cancelado não pode ser rejeitado");
        }
        if (status != PaymentStatus.PENDING && status != PaymentStatus.CREATED) {
            throw new BusinessException("Apenas pagamentos pendentes ou criados podem ser rejeitados");
        }
        this.status = PaymentStatus.REJECTED;
        this.rejectionReason = reason;
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        if (status == PaymentStatus.APPROVED) {
            throw new BusinessException("Pagamento aprovado não pode ser cancelado");
        }
        if (status == PaymentStatus.CANCELLED) {
            throw new BusinessException("Pagamento já está cancelado");
        }
        this.status = PaymentStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    public void expire() {
        if (status == PaymentStatus.APPROVED) {
            throw new BusinessException("Pagamento aprovado não pode expirar");
        }
        if (status == PaymentStatus.CANCELLED) {
            throw new BusinessException("Pagamento cancelado não pode expirar");
        }
        if (status == PaymentStatus.EXPIRED) {
            throw new BusinessException("Pagamento já está expirado");
        }
        this.status = PaymentStatus.EXPIRED;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isApproved() {
        return this.status == PaymentStatus.APPROVED;
    }

    public boolean isPending() {
        return this.status == PaymentStatus.PENDING;
    }

    public boolean isRejected() {
        return this.status == PaymentStatus.REJECTED;
    }

    public boolean isCancelled() {
        return this.status == PaymentStatus.CANCELLED;
    }

    public boolean isExpired() {
        return this.status == PaymentStatus.EXPIRED;
    }

    private void validateOrderId(OrderId orderId) {
        if (orderId == null) {
            throw new BusinessException("OrderId não pode ser nulo");
        }
    }

    private void validateAmount(Money amount) {
        if (amount == null) {
            throw new BusinessException("Valor do pagamento não pode ser nulo");
        }
    }

    private void validateMethod(PaymentMethod method) {
        if (method == null) {
            throw new BusinessException("Método de pagamento não pode ser nulo");
        }
    }

    private void validateGateway(PaymentGateway gateway) {
        if (gateway == null) {
            throw new BusinessException("Gateway de pagamento não pode ser nulo");
        }
    }
}

