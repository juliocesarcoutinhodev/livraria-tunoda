package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GenerateOrderReportUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GenerateShippingLabelUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.ListOrdersUseCase;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final ListOrdersUseCase listOrdersUseCase;
    private final GenerateOrderReportUseCase generateOrderReportUseCase;
    private final GenerateShippingLabelUseCase generateShippingLabelUseCase;

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> listOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) OrderStatus status,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortDirection
    ) {
        var response = listOrdersUseCase.execute(page, size, status, sortBy, sortDirection);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{orderId}/report", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadOrderReport(@PathVariable String orderId) {
        var pdf = generateOrderReportUseCase.execute(orderId);

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
            .filename("pedido-" + orderId + ".pdf")
            .build());

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdf);
    }

    @GetMapping(value = "/{orderId}/shipping-label", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadShippingLabel(@PathVariable String orderId) {
        var pdf = generateShippingLabelUseCase.execute(orderId);

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
            .filename("etiqueta-" + orderId + ".pdf")
            .build());

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdf);
    }
}
