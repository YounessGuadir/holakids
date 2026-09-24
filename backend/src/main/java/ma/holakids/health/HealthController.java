package ma.holakids.health;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/health", "/api/health"})
public class HealthController {

    private static final String APPLICATION_NAME = "HOLAKIDS";

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping
    @Operation(summary = "Vérifie la connexion entre l'API et PostgreSQL")
    public ResponseEntity<HealthResponse> health() {
        if (healthService.isDatabaseConnected()) {
            return ResponseEntity.ok(new HealthResponse("UP", APPLICATION_NAME));
        }

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new HealthResponse("DOWN", APPLICATION_NAME));
    }
}
