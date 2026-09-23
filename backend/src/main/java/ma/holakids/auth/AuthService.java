package ma.holakids.auth;

import ma.holakids.auth.dto.AuthResponse;
import ma.holakids.auth.dto.LoginRequest;
import ma.holakids.auth.dto.RegisterRequest;
import ma.holakids.auth.dto.UserResponse;
import ma.holakids.common.ConflictException;
import ma.holakids.common.ResourceNotFoundException;
import ma.holakids.security.JwtService;
import ma.holakids.user.Role;
import ma.holakids.user.User;
import ma.holakids.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Cette adresse e-mail est déjà utilisée.");
        }

        User user = new User(
                request.fullName().trim(),
                email,
                passwordEncoder.encode(request.password()),
                Role.CLIENT);
        userRepository.save(user);
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(this::toUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                jwtService.getExpirationSeconds(),
                toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
