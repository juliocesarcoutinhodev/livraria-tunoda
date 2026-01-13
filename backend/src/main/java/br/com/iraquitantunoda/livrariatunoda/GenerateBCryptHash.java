package br.com.iraquitantunoda.livrariatunoda;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitario para gerar hash BCrypt de senhas.
 * Executar: mvn exec:java -Dexec.mainClass="br.com.iraquitantunoda.livrariatunoda.GenerateBCryptHash"
 */
public class GenerateBCryptHash {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

        String password = "admin123";
        String hash = encoder.encode(password);

        System.out.println("=================================");
        System.out.println("GERACAO DE HASH BCRYPT");
        System.out.println("=================================");
        System.out.println("Senha: " + password);
        System.out.println("Hash:  " + hash);
        System.out.println("=================================");
        System.out.println("\nVerificacao: " + encoder.matches(password, hash));
        System.out.println("=================================");

        // Testa o hash da migration atual
        String oldHash = "$2a$12$P0yvBoH9ucTiDfcUjG5T2uWsfyPLfRsJbpvsSOJ9Aqh1vWvdUOMtK";
        System.out.println("\nTestando hash da migration:");
        System.out.println("Hash antigo valido? " + encoder.matches(password, oldHash));
        System.out.println("=================================");
    }
}

