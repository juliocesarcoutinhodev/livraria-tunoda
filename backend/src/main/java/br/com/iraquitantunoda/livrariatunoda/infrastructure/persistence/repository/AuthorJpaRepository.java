package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorJpaRepository extends JpaRepository<AuthorEntity, String> {

    List<AuthorEntity> findByStatus(Status status);

    Page<AuthorEntity> findByStatus(Status status, Pageable pageable);

    @Query("SELECT a FROM AuthorEntity a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%')))")
    Page<AuthorEntity> findWithFilters(
        @Param("status") Status status,
        @Param("name") String name,
        Pageable pageable
    );
}

