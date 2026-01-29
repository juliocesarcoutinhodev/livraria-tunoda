package br.com.iraquitantunoda.livrariatunoda.domain.service;

public interface OrderReportGenerator {

    byte[] generateOrderReportPdf(String orderId);
}
