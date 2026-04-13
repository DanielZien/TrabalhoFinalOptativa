package com.example.api.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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

    private final String API_ORIGINAL_REGISTER_URL = "https://event-flow-vercel.vercel.app/auth/register";
    
   
    private final String API_ORIGINAL_UPDATE_URL = "https://event-flow-vercel.vercel.app/users/profile"; 


    // ROTA 1: REGISTRO DE NOVO USUÁRIO
    
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam("telefone") String telefone,
            @RequestParam("senha") String senha,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        try {
            String urlImagem = null;

            if (imagem != null && !imagem.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(imagem.getBytes(), ObjectUtils.emptyMap());
                urlImagem = uploadResult.get("secure_url").toString();
            }

            Map<String, Object> payloadApiOriginal = new HashMap<>();
            payloadApiOriginal.put("nome", nome);
            payloadApiOriginal.put("email", email);
            payloadApiOriginal.put("telefone", telefone);
            payloadApiOriginal.put("password", senha);
            
            if (urlImagem != null) {
                payloadApiOriginal.put("imagem", urlImagem);
            }

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payloadApiOriginal, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(API_ORIGINAL_REGISTER_URL, requestEntity, String.class);

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar imagem ou salvar usuário: " + e.getMessage());
        }
    }


    // ROTA 2: ATUALIZAÇÃO DE PERFIL

    @PutMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(
            @RequestHeader("Authorization") String token, // Pegamos o token do React!
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam("telefone") String telefone,
            @RequestParam(value = "password", required = false) String password, // Senha agora é opcional
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        try {
            String urlImagem = null;

            // 1. Upload da nova imagem (se enviada)
            if (imagem != null && !imagem.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(imagem.getBytes(), ObjectUtils.emptyMap());
                urlImagem = uploadResult.get("secure_url").toString();
            }

            // 2. Monta o Payload JSON
            Map<String, Object> payloadApiOriginal = new HashMap<>();
            payloadApiOriginal.put("nome", nome);
            payloadApiOriginal.put("email", email);
            payloadApiOriginal.put("telefone", telefone);
            
            // Só manda a senha se o usuário realmente preencheu algo
            if (password != null && !password.isEmpty()) {
                payloadApiOriginal.put("password", password);
            }
            
            if (urlImagem != null) {
                payloadApiOriginal.put("imagem", urlImagem);
            }

            // 3. Dispara para a API original no Vercel passando o Token
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", token); // Repassa o token para a Vercel saber quem é

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payloadApiOriginal, headers);
            
            // Usamos o exchange() aqui porque estamos fazendo um PUT/PATCH com cabeçalhos customizados
            ResponseEntity<String> response = restTemplate.exchange(
                    API_ORIGINAL_UPDATE_URL, 
                    HttpMethod.PUT, // Mude para HttpMethod.PATCH se a sua API exigir PATCH
                    requestEntity, 
                    String.class
            );

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar o perfil: " + e.getMessage());
        }
    }
}