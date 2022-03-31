<?php
  add_action( "init", "init_create_taxonomies", 0 );

  function init_create_taxonomies() {
    //create_taxonomies("page_categories", "page", "Categoría", "Categorías", "PageCategory", "PageCategories");
    create_taxonomies("news_categories", "news", "Categoría", "Categorías", "NewsCategory", "NewsCategories");
    create_taxonomies("projects_categories", "projects", "Categoría", "Categorías", "ProjectsCategory", "ProjectsCategories");
  }

  function create_taxonomies($slug, $destiny, $singular, $plural, $GraphSingular, $GraphPlural) {
    $labels = array(
          "name"                       => $plural,
          "singular_name"              => $singular,
          "menu_name"                  => $plural,
        );
        $args = array(
          "labels"                     => $labels,
          "hierarchical"               => true,
          "public"                     => true,
          "show_ui"                    => true,
          "show_in_quick_edit"         => false,
          "meta_box_cb"                => false,
          "show_admin_column"          => false,
          "show_in_nav_menus"          => false,
          "show_tagcloud"              => false,
          "show_in_rest"               => true,
          "show_in_graphql"            => true,
          "graphql_single_name"        => $GraphSingular,
          "graphql_plural_name"        => $GraphPlural,
        );

    register_taxonomy( $slug, array( $destiny ), $args );
  }
?>