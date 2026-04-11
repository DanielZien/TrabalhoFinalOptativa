package com.example.api.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@RestController
@RequestMapping("/api/bff/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioBffController {

    @Autowired
    private Cloudinary cloudinary;

    // Atenção: Verifique se a rota de cadastro da sua API é exatamente essa (/auth/register ou /users)
    private final String API_ORIGINAL_URL = "https://event-flow-vercel.vercel.app/auth/register";

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam("telefone") String telefone,
            @RequestParam("senha") String senha,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        try {
            String urlImagem = null;

            // 1. Upload da imagem para o Cloudinary (se o usuário enviou uma)
            if (imagem != null && !imagem.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(imagem.getBytes(), ObjectUtils.emptyMap());
                urlImagem = uploadResult.get("secure_url").toString();
            }

            // 2. Monta o Payload JSON para a API Original
            Map<String, Object> payloadApiOriginal = new HashMap<>();
            payloadApiOriginal.put("nome", nome);
            payloadApiOriginal.put("email", email);
            payloadApiOriginal.put("telefone", telefone);
            payloadApiOriginal.put("password", senha);
            
            // Só adiciona a chave de imagem se tiver feito o upload com sucesso
            if (urlImagem != null) {
                payloadApiOriginal.put("imagem", urlImagem);
            }

            // 3. Dispara para a API original no Vercel
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payloadApiOriginal, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(API_ORIGINAL_URL, requestEntity, String.class);

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar imagem ou salvar usuário: " + e.getMessage());
        }
    }
}