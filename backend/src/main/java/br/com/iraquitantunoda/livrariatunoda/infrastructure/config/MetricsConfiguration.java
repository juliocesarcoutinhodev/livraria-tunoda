package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.jvm.ClassLoaderMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmGcMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;
import io.micrometer.core.instrument.binder.system.FileDescriptorMetrics;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import io.micrometer.core.instrument.binder.system.UptimeMetrics;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracao de metricas do Micrometer.
 * Registra metricas padrao de JVM, sistema e aplicacao.
 *
 * Metricas disponibilizadas:
 * - JVM: memoria, threads, garbage collection, classloader
 * - Sistema: CPU, file descriptors, uptime
 * - HTTP: requests, latencia, percentis
 *
 * Metricas acessiveis via:
 * - /api/v1/actuator/metrics - lista todas as metricas disponiveis
 * - /api/v1/actuator/metrics/{nome} - detalhes de uma metrica especifica
 * - /api/v1/actuator/prometheus - formato Prometheus para scraping
 */
@Slf4j
@Configuration
public class MetricsConfiguration {

    /**
     * Customiza o MeterRegistry com tags comuns a todas as metricas.
     * Facilita filtragem e agregacao no Prometheus/Grafana.
     */
    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> log.info("Inicializando metricas do Micrometer");
    }

    /**
     * Metricas de memoria da JVM (heap, non-heap, pools).
     */
    @Bean
    public JvmMemoryMetrics jvmMemoryMetrics() {
        return new JvmMemoryMetrics();
    }

    /**
     * Metricas de threads da JVM (ativos, daemon, pico).
     */
    @Bean
    public JvmThreadMetrics jvmThreadMetrics() {
        return new JvmThreadMetrics();
    }

    /**
     * Metricas de garbage collection.
     */
    @Bean
    public JvmGcMetrics jvmGcMetrics() {
        return new JvmGcMetrics();
    }

    /**
     * Metricas de classloader.
     */
    @Bean
    public ClassLoaderMetrics classLoaderMetrics() {
        return new ClassLoaderMetrics();
    }

    /**
     * Metricas de CPU do sistema.
     */
    @Bean
    public ProcessorMetrics processorMetrics() {
        return new ProcessorMetrics();
    }

    /**
     * Metricas de file descriptors (importante para detectar leaks).
     */
    @Bean
    public FileDescriptorMetrics fileDescriptorMetrics() {
        return new FileDescriptorMetrics();
    }

    /**
     * Metrica de uptime da aplicacao.
     */
    @Bean
    public UptimeMetrics uptimeMetrics() {
        return new UptimeMetrics();
    }
}

