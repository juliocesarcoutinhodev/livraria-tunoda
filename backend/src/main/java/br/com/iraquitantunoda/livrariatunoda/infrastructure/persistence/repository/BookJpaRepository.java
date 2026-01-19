package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookJpaRepository extends JpaRepository<BookEntity, String> {

    List<BookEntity> findByStatus(Status status);

    Page<BookEntity> findByStatus(Status status, Pageable pageable);

    long countByAuthorIdsContainingAndStatus(String authorId, Status status);

    @Query("SELECT b FROM BookEntity b WHERE " +
           "b.status = 'ACTIVE' AND " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%')))")
    Page<BookEntity> findAllActiveWithFilters(
        @Param("title") String title,
        Pageable pageable
    );

    @Query("SELECT b FROM BookEntity b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:authorId IS NULL OR :authorId MEMBER OF b.authorIds) AND " +
           "(:lowStock IS NULL OR (:lowStock = true AND b.stock < 10)) AND " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%')))")
    Page<BookEntity> findAllWithFilters(
        @Param("status") Status status,
        @Param("authorId") String authorId,
        @Param("lowStock") Boolean lowStock,
        @Param("title") String title,
        Pageable pageable
    );
}
