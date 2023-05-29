
package expo.modules.transparentnavigation

import android.app.Activity
import android.content.Context
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import android.os.Build;

import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class ExpoTransparentNavigationReactActivityLifecycleListener(activityContext: Context) : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {

    val styles: String = getNavigationBarStyle(activity)
    val window: Window = activity.window
    val decorView: View = window.decorView

    val insetsController = WindowInsetsControllerCompat(window, decorView)

    WindowCompat.setDecorFitsSystemWindows(window, false)

    ViewCompat.setOnApplyWindowInsetsListener(decorView
    ) { view, windowInsets ->
      val paddingBottom: Int = windowInsets.getInsets(WindowInsetsCompat.Type.ime()).bottom
      if (paddingBottom != view.paddingBottom) {
        val paddingLeft: Int = view.paddingLeft
        val paddingTop: Int = view.paddingTop
        val paddingRight: Int = view.paddingRight
        view.setPadding(paddingLeft, paddingTop, paddingRight, paddingBottom)
      }
      windowInsets
    }

    activity.runOnUiThread {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
        window.clearFlags(
          WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS or
                  WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        )
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        insetsController.isAppearanceLightStatusBars = "dark-content" == styles
        insetsController.isAppearanceLightNavigationBars = "dark-content" == styles
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          window.isStatusBarContrastEnforced = false
          window.isNavigationBarContrastEnforced = false
        }
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
        window.statusBarColor = Color.TRANSPARENT
        insetsController.isAppearanceLightStatusBars = "dark-content" == styles
      } else {
        window.addFlags(
          WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS or
                  WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        )
      }
    }
  }

  private fun getNavigationBarStyle(context: Context): String =
    context.getString(R.string.navigation_bar_style)
}