package com.bajrix.marketplace.dto;

import java.util.UUID;

public class CategoryDTO {
    private UUID id;
    private String name;
    private String slug;
    private String icon;
    private String description;

    public CategoryDTO() {}

    public CategoryDTO(UUID id, String name, String slug, String icon, String description) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.icon = icon;
        this.description = description;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private String name;
        private String slug;
        private String icon;
        private String description;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder description(String description) { this.description = description; return this; }

        public CategoryDTO build() {
            return new CategoryDTO(id, name, slug, icon, description);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
