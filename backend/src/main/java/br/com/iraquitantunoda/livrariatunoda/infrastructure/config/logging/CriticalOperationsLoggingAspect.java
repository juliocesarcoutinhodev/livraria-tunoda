package br.com.iraquitantunoda.livrariatunoda.infrastructure.config.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Aspecto para logging de requisicoes criticas.
 * Loga entrada, saida e erros em operacoes de pedido, pagamento e frete.
 */
@Aspect
@Component
@Slf4j
public class CriticalOperationsLoggingAspect {

    private final boolean isProduction;

    public CriticalOperationsLoggingAspect(Environment environment) {
        this.isProduction = Arrays.stream(environment.getActiveProfiles())
            .anyMatch(profile -> profile.equals("prod") || profile.equals("production"));
    }

    @Pointcut("execution(* br.com.iraquitantunoda.livrariatunoda.application.usecase.CreatePaymentUseCase.execute(..))")
    public void createPayment() {}

    @Pointcut("execution(* br.com.iraquitantunoda.livrariatunoda.application.usecase.ProcessPaymentUseCase.execute(..))")
    public void processPayment() {}

    @Pointcut("execution(* br.com.iraquitantunoda.livrariatunoda.application.usecase.CalculateShippingUseCase.execute(..))")
    public void calculateShipping() {}

    @Pointcut("execution(* br.com.iraquitantunoda.livrariatunoda.application.usecase.SelectShippingOptionUseCase.execute(..))")
    public void selectShipping() {}

    @Around("createPayment() || processPayment() || calculateShipping() || selectShipping()")
    public Object logCriticalOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        Object[] args = joinPoint.getArgs();

        // Log de entrada (sem dados sensíveis)
        if (isProduction) {
            log.info("Iniciando operação crítica: {}.{}", className, methodName);
        } else {
            log.info("Iniciando operação crítica: {}.{} com argumentos: {}",
                className, methodName, sanitizeArgs(args));
        }

        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            // Log de sucesso
            log.info("Operação crítica concluída com sucesso: {}.{} em {}ms",
                className, methodName, duration);

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;

            // Log de erro (stacktrace apenas em não produção)
            if (isProduction) {
                log.error("Erro na operação crítica: {}.{} após {}ms - Erro: {}",
                    className, methodName, duration, e.getMessage());
            } else {
                log.error("Erro na operação crítica: {}.{} após {}ms",
                    className, methodName, duration, e);
            }

            throw e;
        }
    }

    private String sanitizeArgs(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }

        // Converte args para string, mas oculta dados sensíveis
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < args.length; i++) {
            if (i > 0) sb.append(", ");

            Object arg = args[i];
            if (arg == null) {
                sb.append("null");
            } else {
                String argStr = arg.toString();
                // Remove possíveis dados sensíveis
                argStr = argStr.replaceAll("(?i)(token|password|senha|cpf|card)=[^,\\s}]+", "$1=***");
                sb.append(argStr);
            }
        }
        sb.append("]");
        return sb.toString();
    }
}

