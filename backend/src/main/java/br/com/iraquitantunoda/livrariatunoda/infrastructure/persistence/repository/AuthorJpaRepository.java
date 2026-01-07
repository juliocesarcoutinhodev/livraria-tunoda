package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorJpaRepository extends JpaRepository<AuthorEntity, String> {

    List<AuthorEntity> findByStatus(Status status);
}

