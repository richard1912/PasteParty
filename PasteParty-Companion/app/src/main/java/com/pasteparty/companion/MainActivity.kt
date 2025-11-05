package com.pasteparty.companion

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.pasteparty.companion.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var preferencesManager: PreferencesManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        preferencesManager = PreferencesManager(this)

        // Load current server URL
        val currentUrl = preferencesManager.getServerUrl()
        binding.serverUrlEditText.setText(currentUrl)

        // Save button click handler
        binding.saveButton.setOnClickListener {
            saveServerUrl()
        }
    }

    private fun saveServerUrl() {
        val url = binding.serverUrlEditText.text?.toString()?.trim() ?: ""
        
        if (url.isEmpty()) {
            Toast.makeText(this, getString(R.string.server_url_required), Toast.LENGTH_SHORT).show()
            return
        }

        // Basic URL validation
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            Toast.makeText(this, getString(R.string.invalid_url), Toast.LENGTH_SHORT).show()
            return
        }

        preferencesManager.setServerUrl(url)
        Toast.makeText(this, "Server URL saved!", Toast.LENGTH_SHORT).show()
    }
}


