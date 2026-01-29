package br.com.iraquitantunoda.livrariatunoda.infrastructure.report;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.service.ShippingLabelGenerator;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class JasperShippingLabelGenerator implements ShippingLabelGenerator {

    private static final String LABEL_REPORT_PATH = "reports/etiqueta_envio.jasper";

    private final DataSource dataSource;

    private JasperReport labelReport;

    @PostConstruct
    void init() {
        try (InputStream labelStream = new ClassPathResource(LABEL_REPORT_PATH).getInputStream()) {
            this.labelReport = (JasperReport) JRLoader.loadObject(labelStream);
        } catch (IOException | JRException ex) {
            log.error("Erro ao carregar o template da etiqueta de envio", ex);
            throw new IllegalStateException("Falha ao inicializar template da etiqueta", ex);
        }
    }

    @Override
    public byte[] generateShippingLabelPdf(String orderId) {
        var parameters = new HashMap<String, Object>();
        parameters.put("ORDER_ID", orderId);

        try (var connection = dataSource.getConnection()) {
            JasperPrint print = JasperFillManager.fillReport(labelReport, parameters, connection);
            return JasperExportManager.exportReportToPdf(print);
        } catch (JRException | SQLException ex) {
            log.error("Erro ao gerar etiqueta do pedido {}", orderId, ex);
            throw new BusinessException("Nao foi possivel gerar a etiqueta do pedido");
        }
    }
}
