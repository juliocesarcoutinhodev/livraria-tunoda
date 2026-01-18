package br.com.iraquitantunoda.livrariatunoda;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class StartupApplicationTests {

    @Test
    void contextLoads() {
        // Test if Spring context loads successfully
    }

}
