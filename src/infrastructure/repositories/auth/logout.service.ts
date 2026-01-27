interface LogoutResult {
  success: boolean;
  message?: string;
  error?: string;
  status: number;
}

export async function logout(): Promise<LogoutResult> {
  try {
    return {
      success: true,
      message: "Logged out successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Internal server error",
      status: 500,
    };
  }
}
