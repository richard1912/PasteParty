package com.pasteparty.companion

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.pasteparty.companion.databinding.ActivityShareReceiverBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import android.util.Base64

class ShareReceiverActivity : AppCompatActivity() {
    private lateinit var binding: ActivityShareReceiverBinding
    private lateinit var preferencesManager: PreferencesManager
    private val REQUEST_PERMISSION_CODE = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityShareReceiverBinding.inflate(layoutInflater)
        setContentView(binding.root)

        preferencesManager = PreferencesManager(this)

        handleIncomingIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIncomingIntent(intent)
    }

    private fun handleIncomingIntent(intent: Intent) {
        val action = intent.action
        val type = intent.type

        if (Intent.ACTION_SEND == action && type != null) {
            when {
                type.startsWith("text/") -> handleSharedText(intent)
                type.startsWith("image/") -> handleSharedImage(intent)
                else -> {
                    showError("Unsupported content type: $type")
                }
            }
        } else {
            showError("No content to share")
        }
    }

    private fun handleSharedText(intent: Intent) {
        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
        if (sharedText != null && sharedText.isNotEmpty()) {
            sendTextToServer(sharedText)
        } else {
            showError("No text content found")
        }
    }

    private fun handleSharedImage(intent: Intent) {
        val imageUri: Uri? = intent.getParcelableExtra(Intent.EXTRA_STREAM)
        if (imageUri != null) {
            checkPermissionAndSendImage(imageUri)
        } else {
            showError("No image content found")
        }
    }

    private fun checkPermissionAndSendImage(uri: Uri) {
        // Try to read the image first - content URIs from share might not need permissions
        try {
            contentResolver.openInputStream(uri)?.use {
                // If we can read it, we don't need permissions
                sendImageToServer(uri)
                return
            }
        } catch (e: SecurityException) {
            // Need to request permission
        }
        
        // Request permission if needed
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_IMAGES
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }

        if (ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED) {
            sendImageToServer(uri)
        } else {
            ActivityCompat.requestPermissions(this, arrayOf(permission), REQUEST_PERMISSION_CODE)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_PERMISSION_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                val imageUri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                if (imageUri != null) {
                    sendImageToServer(imageUri)
                }
            } else {
                showError("Permission denied. Cannot read image.")
            }
        }
    }

    private fun sendTextToServer(text: String) {
        val serverUrl = preferencesManager.getServerUrl()
        if (serverUrl.isEmpty()) {
            showErrorWithSettings(getString(R.string.no_server_url))
            return
        }

        binding.statusTextView.text = getString(R.string.sending)
        binding.progressBar.visibility = android.view.View.VISIBLE

        val api = PastePartyApi(serverUrl)
        api.sendText(text, object : PastePartyApi.Callback {
            override fun onSuccess(pasteId: String) {
                runOnUiThread {
                    binding.progressBar.visibility = android.view.View.GONE
                    binding.statusTextView.text = getString(R.string.success)
                    binding.closeButton.visibility = android.view.View.VISIBLE
                    binding.closeButton.setOnClickListener {
                        finish()
                    }
                    Toast.makeText(this@ShareReceiverActivity, getString(R.string.success), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onError(error: String) {
                runOnUiThread {
                    binding.progressBar.visibility = android.view.View.GONE
                    showError(error)
                }
            }
        })
    }

    private fun sendImageToServer(uri: Uri) {
        val serverUrl = preferencesManager.getServerUrl()
        if (serverUrl.isEmpty()) {
            showErrorWithSettings(getString(R.string.no_server_url))
            return
        }

        binding.statusTextView.text = getString(R.string.sending)
        binding.progressBar.visibility = android.view.View.VISIBLE

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val base64Image = convertImageToBase64(uri)
                withContext(Dispatchers.Main) {
                    val api = PastePartyApi(serverUrl)
                    api.sendImage(base64Image, object : PastePartyApi.Callback {
                        override fun onSuccess(pasteId: String) {
                            runOnUiThread {
                                binding.progressBar.visibility = android.view.View.GONE
                                binding.statusTextView.text = getString(R.string.success)
                                binding.closeButton.visibility = android.view.View.VISIBLE
                                binding.closeButton.setOnClickListener {
                                    finish()
                                }
                                Toast.makeText(this@ShareReceiverActivity, getString(R.string.success), Toast.LENGTH_SHORT).show()
                            }
                        }

                        override fun onError(error: String) {
                            runOnUiThread {
                                binding.progressBar.visibility = android.view.View.GONE
                                showError(error)
                            }
                        }
                    })
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    binding.progressBar.visibility = android.view.View.GONE
                    showError("Failed to process image: ${e.message}")
                }
            }
        }
    }

    private suspend fun convertImageToBase64(uri: Uri): String = withContext(Dispatchers.IO) {
        contentResolver.openInputStream(uri)?.use { inputStream ->
            val bytes = inputStream.readBytes()
            val base64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
            
            // Determine MIME type from URI
            val mimeType = contentResolver.getType(uri) ?: "image/png"
            
            // Return as data URL format
            "data:$mimeType;base64,$base64"
        } ?: throw Exception("Failed to read image")
    }

    private fun showError(message: String) {
        binding.progressBar.visibility = android.view.View.GONE
        binding.statusTextView.text = getString(R.string.error, message)
        binding.closeButton.visibility = android.view.View.VISIBLE
        binding.closeButton.setOnClickListener {
            finish()
        }
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    private fun showErrorWithSettings(message: String) {
        binding.progressBar.visibility = android.view.View.GONE
        binding.statusTextView.text = message
        binding.openSettingsButton.visibility = android.view.View.VISIBLE
        binding.openSettingsButton.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
        binding.closeButton.visibility = android.view.View.VISIBLE
        binding.closeButton.setOnClickListener {
            finish()
        }
    }
}

