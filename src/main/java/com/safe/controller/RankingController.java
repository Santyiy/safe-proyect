package com.safe.controller;

import com.safe.dto.RankingResponseDTO;
import com.safe.repository.RankingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    @Autowired
    private RankingRepository rankingRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRanking() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<RankingResponseDTO> listaRanking = rankingRepository.findAllOrderByPromedio()
                    .stream()
                    .map(RankingResponseDTO::new)
                    .toList();

            response.put("status", "ok");
            response.put("data", listaRanking);
            response.put("message", "Ranking generado correctamente");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener el ranking: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
