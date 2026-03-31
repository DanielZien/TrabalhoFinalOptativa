package com.example.api.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@RestController
@RequestMapping("/api/bff/eventos")
@CrossOrigin(origins = "*")
public class EventoController {
    @Autowired
    private Cloudinary cloudinary;

    // URL da sua API original (a que foi feita em Node/Prisma)
    private final String API_ORIGINAL_URL = "https://event-flow-vercel.vercel.app/events";

    @PostMapping
    public ResponseEntity<?> criarEventoComImagens(
            @RequestParam("titulo") String titulo,
            @RequestParam("descricao") String descricao,
            @RequestParam("data") String data,
            @RequestParam("localizacao") String localizacao,
            @RequestParam("hora_inicio") String horaInicio,
            @RequestParam("hora_fim") String horaFim,
            @RequestParam("categoria") String categoria,
            @RequestParam("preco") Double preco,
            @RequestParam("imagens") MultipartFile[] imagens,
            @RequestHeader(value = "Authorization", required = false) String token) { // Deixamos apenas UM parâmetro!

        try {
            List<String> urlsCloudinary = new ArrayList<>();

            // 1. UPLOAD DAS IMAGENS PRO CLOUDINARY
            for (MultipartFile imagem : imagens) {
                if (!imagem.isEmpty()) {
                    Map uploadResult = cloudinary.uploader().upload(imagem.getBytes(), ObjectUtils.emptyMap());
                    String url = uploadResult.get("secure_url").toString();
                    urlsCloudinary.add(url);
                }
            }

            // Junta as URLs com "|"
            String imagemStringFinal = String.join("|", urlsCloudinary);

            // 2. MONTA O PAYLOAD PARA A API ORIGINAL
            Map<String, Object> payloadApiOriginal = new HashMap<>();
            payloadApiOriginal.put("titulo", titulo);
            payloadApiOriginal.put("descricao", descricao);
            payloadApiOriginal.put("data", data);
            payloadApiOriginal.put("localizacao", localizacao);
            payloadApiOriginal.put("hora_inicio", horaInicio);
            payloadApiOriginal.put("hora_fim", horaFim);
            payloadApiOriginal.put("categoria", categoria);
            payloadApiOriginal.put("preco", preco);
            payloadApiOriginal.put("imagem", imagemStringFinal); // As URLs limpinhas aqui!

            // 3. FAZ A REQUISIÇÃO PARA A API ORIGINAL
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // --- INÍCIO DA MÁGICA DE DEBUG E FORMATAÇÃO DO TOKEN ---
            System.out.println("==== DEBUG DE AUTENTICAÇÃO ====");
            System.out.println("Token recebido do Front-end: " + token);
            
            if (token != null && !token.isBlank() && !token.equals("undefined")) {
                // Garante que o token tenha a palavra "Bearer " antes de mandar pro Node
                if (!token.startsWith("Bearer ")) {
                    headers.set("Authorization", "Bearer " + token);
                    System.out.println("Token formatado e enviado ao Node: Bearer " + token);
                } else {
                    headers.set("Authorization", token);
                    System.out.println("Token enviado ao Node (já tinha Bearer): " + token);
                }
            } else {
                System.out.println("ALERTA CRÍTICO: Nenhum token válido chegou do front-end!");
            }
            System.out.println("===============================");
            // --- FIM DA MÁGICA ---
            
            // Só repassa o token se ele realmente veio do front-end
            if (token != null) {
                headers.set("Authorization", token);
            }

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payloadApiOriginal, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(API_ORIGINAL_URL, requestEntity, String.class);

            // Retorna o sucesso para o frontend
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            // Se der qualquer erro no Cloudinary ou na API original, cai aqui
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar imagens ou salvar na API: " + e.getMessage());
        }
    }
}