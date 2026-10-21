//
//  SceneDelegate.swift
//  neurovision
//
//  Created by Sehaj Narula on 21/10/26.
//

import UIKit
import React
import React_RCTAppDelegate

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else {
      return
    }

    let newWindow = UIWindow(windowScene: windowScene)
    window = newWindow
    appDelegate.window = newWindow

    factory.startReactNative(
      withModuleName: "neurovision",
      in: newWindow,
      launchOptions: nil
    )
  }
}
