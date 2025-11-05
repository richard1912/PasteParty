package com.pasteparty.companion

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class PastePartyApi(private val serverUrl: String) {
    
    private val client = OkHttpClient()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    data class PasteRequest(val content: String, val type: String)
    
    interface Callback {
        fun onSuccess(pasteId: String)
        fun onError(error: String)
    }

    fun sendText(text: String, callback: Callback) {
        val requestBody = JSONObject().apply {
            put("content", text)
            put("type", "text")
        }.toString().toRequestBody(jsonMediaType)

        val request = Request.Builder()
            .url("$serverUrl/api/paste")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback.onError(e.message ?: "Network error")
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (it.isSuccessful) {
                        try {
                            val responseBody = it.body?.string() ?: ""
                            val jsonResponse = JSONObject(responseBody)
                            val pasteId = jsonResponse.optString("id", "unknown")
                            callback.onSuccess(pasteId)
                        } catch (e: Exception) {
                            callback.onError("Failed to parse response: ${e.message}")
                        }
                    } else {
                        callback.onError("Server error: ${it.code} ${it.message}")
                    }
                }
            }
        })
    }

    fun sendImage(base64Image: String, callback: Callback) {
        // Ensure base64Image is a data URL (starts with data:image)
        val imageContent = if (base64Image.startsWith("data:image")) {
            base64Image
        } else {
            "data:image/png;base64,$base64Image"
        }

        val requestBody = JSONObject().apply {
            put("content", imageContent)
            put("type", "image")
        }.toString().toRequestBody(jsonMediaType)

        val request = Request.Builder()
            .url("$serverUrl/api/paste")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback.onError(e.message ?: "Network error")
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (it.isSuccessful) {
                        try {
                            val responseBody = it.body?.string() ?: ""
                            val jsonResponse = JSONObject(responseBody)
                            val pasteId = jsonResponse.optString("id", "unknown")
                            callback.onSuccess(pasteId)
                        } catch (e: Exception) {
                            callback.onError("Failed to parse response: ${e.message}")
                        }
                    } else {
                        callback.onError("Server error: ${it.code} ${it.message}")
                    }
                }
            }
        })
    }
}


