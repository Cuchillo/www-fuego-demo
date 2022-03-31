<?php
  add_action( "init", "init_create_custom_post_type");

  function init_create_custom_post_type() {
    create_custom_post_type("legales", "/", "Texto Legal", "Textos Legales", 5, "dashicons-hammer");
    create_custom_post_type("projects", "projects", "Proyecto", "Proyectos", 6, "dashicons-welcome-view-site");
    create_custom_post_type("news", "news", "Noticia", "Noticias", 7, "dashicons-media-text");
  }

  function create_custom_post_type(
                $slug, // Slug identificativo
                $path, // Path url '/' para que cuelgue de root
                $name, // Nombre
                $plural, // Nombre Plural
                $position, // De momento no hace nada
                $icon // Icono
                ) {
    //////Custom
    register_post_type($slug, // Register Custom Post Type
            array(
              "labels" => array(
                "name"                => $plural, // Rename these to suit
                "singular_name"       => $name
              ),
              "rewrite" => array(
                  'slug' => $path, // use this slug instead of post type name
                  'with_front' => FALSE // if you have a permalink base such as /blog/ then setting this to false ensures your custom post type permalink structure will be /products/ instead of /blog/products/
                       ),
              "menu_position"         => $position,
              "menu_icon"             => $icon,
              "public"                => true,
              "show_in_rest"          => true,
              "show_ui"               => true,
              "show_in_menu"          => true,
              "publicly_queryable"    => true,
              "capability_type"       => "page",
              "hierarchical"          => true,
              "has_archive"           => true,
              "supports"              => array(), // Other Options: trackbacks, custom-fields, page-attributes, comments, post-formats
              "can_export"            => true, // Allows export in Tools > Export
              "taxonomies"            => array(), // Add supported taxonomies,
              "show_in_graphql"       => true,
              "graphql_single_name"   => $name,
              "graphql_plural_name"   => $plural,
            )
          );

  }
?>