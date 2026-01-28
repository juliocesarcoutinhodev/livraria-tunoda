package br.com.iraquitantunoda.livrariatunoda.domain.service;

/**
 * Interface para resolucao de URLs do frontend.
 */
public interface FrontendUrlProvider {
    String getOrderConfirmationUrl(String orderId);
}
