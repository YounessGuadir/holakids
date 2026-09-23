package ma.holakids.catalog;

import java.util.List;

import ma.holakids.catalog.dto.CategoryRequest;
import ma.holakids.catalog.dto.CategoryResponse;
import ma.holakids.common.ConflictException;
import ma.holakids.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listPublic() {
        return categoryRepository.findAllByActiveTrueOrderByDisplayOrderAscNameFrAsc().stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAdmin() {
        return categoryRepository.findAll().stream()
                .sorted((left, right) -> Integer.compare(left.getDisplayOrder(), right.getDisplayOrder()))
                .map(CategoryMapper::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsBySlugIgnoreCase(request.slug())) {
            throw new ConflictException("Une catégorie utilise déjà ce slug.");
        }
        Category category = new Category();
        apply(category, request);
        return CategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getEntity(id);
        categoryRepository.findBySlugIgnoreCase(request.slug())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new ConflictException("Une catégorie utilise déjà ce slug.");
                });
        apply(category, request);
        return CategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = getEntity(id);
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public Category getEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable."));
    }

    private void apply(Category category, CategoryRequest request) {
        category.setSlug(request.slug().trim().toLowerCase());
        category.setNameFr(request.nameFr().trim());
        category.setNameAr(request.nameAr().trim());
        category.setDescriptionFr(request.descriptionFr().trim());
        category.setDescriptionAr(request.descriptionAr().trim());
        category.setImageUrl(request.imageUrl().trim());
        category.setColor(request.color().trim());
        category.setDisplayOrder(request.displayOrder());
        category.setActive(request.active());
    }
}
