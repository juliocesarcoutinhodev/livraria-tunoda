package br.com.iraquitantunoda.livrariatunoda.domain.service;

public interface ShippingLabelGenerator {

    byte[] generateShippingLabelPdf(String orderId);
}
