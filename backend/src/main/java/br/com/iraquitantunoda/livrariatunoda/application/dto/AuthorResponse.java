package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record AuthorResponse(
    String id,
    String name,
    String biography,
    String photoUrl,
    String status
) {
}

