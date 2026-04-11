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
            @RequestParam(value = "imagens", required = false) MultipartFile[] imagens,
            @RequestParam(value = "imagem_antiga", required = false) String imagemAntiga, 
            // NOVO: Parâmetro para receber o arquivo do manual (PDF, DOC, etc)
            @RequestParam(value = "manual", required = false) MultipartFile manual,
            @RequestHeader(value = "Authorization", required = false) String token) { 

        try {
            String imagemStringFinal = "";

            // 1. VERIFICA SE TEM IMAGEN
            if (imagens != null && imagens.length > 0 && !imagens[0].isEmpty()) {
                List<String> urlsCloudinary = new ArrayList<>();
                for (MultipartFile imagem : imagens) {
                    if (!imagem.isEmpty()) {
                        Map uploadResult = cloudinary.uploader().upload(imagem.getBytes(), ObjectUtils.emptyMap());
                        String url = uploadResult.get("secure_url").toString();
                        urlsCloudinary.add(url);
                    }
                }
                imagemStringFinal = String.join("|", urlsCloudinary);
            } 
            // 2. SE NÃO TEM IMAGEM
            else if (imagemAntiga != null && !imagemAntiga.isEmpty()) {
                imagemStringFinal = imagemAntiga;
            } else {
                imagemStringFinal = "https://via.placeholder.com/400x200?text=Sem+Imagem";
            }

            // --- 3. LÓGICA DO MANUAL
            String urlManual = "";
            if (manual != null && !manual.isEmpty()) {
                // "resource_type", "auto" é obrigatório para arquivos que não são imagens puras (como PDFs)
                Map uploadResult = cloudinary.uploader().upload(manual.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                urlManual = uploadResult.get("secure_url").toString();
            }

            // Embutindo a URL secreta na descrição
            String descricaoFinal = descricao;
            if (!urlManual.isEmpty()) {
                descricaoFinal = descricao + " ||MANUAL|| " + urlManual;
            }

            Map<String, Object> payloadApiOriginal = new HashMap<>();
            payloadApiOriginal.put("titulo", titulo);
            payloadApiOriginal.put("descricao", descricaoFinal); 
            payloadApiOriginal.put("data", data);
            payloadApiOriginal.put("localizacao", localizacao);
            payloadApiOriginal.put("hora_inicio", horaInicio);
            payloadApiOriginal.put("hora_fim", horaFim);
            payloadApiOriginal.put("categoria", categoria);
            payloadApiOriginal.put("preco", preco);
            payloadApiOriginal.put("imagem", imagemStringFinal); 

            //FAZ A REQUISIÇÃO PARA A API ORIGINAL
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            System.out.println("==== DEBUG DE AUTENTICAÇÃO ====");
            System.out.println("Token recebido do Front-end: " + token);
            
            if (token != null && !token.isBlank() && !token.equals("undefined")) {
                if (!token.startsWith("Bearer ")) {
                    headers.set("Authorization", "Bearer " + token);
                    System.out.println("Token formatado e enviado: Bearer " + token);
                } else {
                    headers.set("Authorization", token);
                    System.out.println("Token enviado (já tinha Bearer): " + token);
                }
            } else {
                System.out.println("ALERTA CRÍTICO: Nenhum token válido chegou do front-end!");
            }
            System.out.println("===============================");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payloadApiOriginal, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(API_ORIGINAL_URL, requestEntity, String.class);

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar arquivos ou salvar na API: " + e.getMessage());
        }
    }
}