package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookJpaRepository extends JpaRepository<BookEntity, String> {

    List<BookEntity> findByStatus(Status status);

    Page<BookEntity> findByStatus(Status status, Pageable pageable);

    long countByAuthorIdsContainingAndStatus(String authorId, Status status);
}
