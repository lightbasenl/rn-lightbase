package expo.modules.transparentnavigation

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class ExpoTransparentNavigationPackage : Package {
  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(ExpoTransparentNavigationReactActivityLifecycleListener(activityContext))
  }
}