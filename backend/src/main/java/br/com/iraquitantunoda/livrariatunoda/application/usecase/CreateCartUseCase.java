package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.CartDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateCartUseCase {

    private final CartRepository cartRepository;
    private final CartDTOMapper cartDTOMapper;

    @Transactional
    public CartResponse execute() {
        var cart = Cart.create();
        var savedCart = cartRepository.save(cart);
        return cartDTOMapper.toResponse(savedCart);
    }
}

