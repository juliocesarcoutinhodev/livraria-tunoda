package br.com.iraquitantunoda.livrariatunoda.infrastructure.report;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.service.OrderReportGenerator;
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
public class JasperOrderReportGenerator implements OrderReportGenerator {

    private static final String MASTER_REPORT_PATH = "reports/pedido.jasper";
    private static final String SUBREPORT_PATH = "reports/sub/itens_pedido.jasper";

    private final DataSource dataSource;

    private JasperReport masterReport;
    private JasperReport subReport;

    @PostConstruct
    void init() {
        try (InputStream masterStream = new ClassPathResource(MASTER_REPORT_PATH).getInputStream();
             InputStream subStream = new ClassPathResource(SUBREPORT_PATH).getInputStream()) {
            this.subReport = (JasperReport) JRLoader.loadObject(subStream);
            this.masterReport = (JasperReport) JRLoader.loadObject(masterStream);
        } catch (IOException | JRException ex) {
            log.error("Erro ao carregar os templates do relatorio de pedido", ex);
            throw new IllegalStateException("Falha ao inicializar templates de relatorio", ex);
        }
    }

    @Override
    public byte[] generateOrderReportPdf(String orderId) {
        var parameters = new HashMap<String, Object>();
        parameters.put("ORDER_ID", orderId);
        parameters.put("SUBREPORT", subReport);

        try (var connection = dataSource.getConnection()) {
            JasperPrint print = JasperFillManager.fillReport(masterReport, parameters, connection);
            return JasperExportManager.exportReportToPdf(print);
        } catch (JRException | SQLException ex) {
            log.error("Erro ao gerar relatorio do pedido {}", orderId, ex);
            throw new BusinessException("Nao foi possivel gerar o relatorio do pedido");
        }
    }
}
