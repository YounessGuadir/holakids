package ma.holakids.importer;

import ma.holakids.user.Role;
import ma.holakids.user.User;
import ma.holakids.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataSeeder.class);

    private final boolean enabled;
    private final String adminEmail;
    private final String adminPassword;
    private final String clientEmail;
    private final String clientPassword;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DatasetImportService datasetImportService;
    private final ProductImportService productImportService;

    public DataSeeder(
            @Value("${application.seed.enabled}") boolean enabled,
            @Value("${application.seed.admin-email}") String adminEmail,
            @Value("${application.seed.admin-password}") String adminPassword,
            @Value("${application.seed.client-email}") String clientEmail,
            @Value("${application.seed.client-password}") String clientPassword,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            DatasetImportService datasetImportService,
            ProductImportService productImportService) {
        this.enabled = enabled;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.clientEmail = clientEmail;
        this.clientPassword = clientPassword;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.datasetImportService = datasetImportService;
        this.productImportService = productImportService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!enabled) {
            LOGGER.info("Import du catalogue désactivé.");
            return;
        }
        seedUsers();
        ProductImportService.ImportResult result =
                productImportService.importDataset(datasetImportService.load());
        LOGGER.info("Dataset HOLAKIDS: {} produits, {} importés, {} déjà présents, {} catégories.",
                result.datasetProducts(), result.imported(), result.skipped(), result.categories());
    }

    private void seedUsers() {
        createUserIfMissing("Administrateur HOLAKIDS", adminEmail, adminPassword, Role.ADMIN);
        createUserIfMissing("Client Démo", clientEmail, clientPassword, Role.CLIENT);
    }

    private void createUserIfMissing(String name, String email, String password, Role role) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            userRepository.save(new User(
                    name,
                    email.trim().toLowerCase(),
                    passwordEncoder.encode(password),
                    role));
        }
    }
}
