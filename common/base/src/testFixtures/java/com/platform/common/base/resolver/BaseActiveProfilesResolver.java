package com.platform.common.base.resolver;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.lang.NonNull;
import org.springframework.test.context.ActiveProfilesResolver;

public class BaseActiveProfilesResolver implements ActiveProfilesResolver {

  private static final Map<String, List<String>> PROFILE_GROUPS = Map.of(
      "local", List.of("base", "datasource-base", "core", "web-base")
  );

  @NonNull
  @Override
  public String @NotNull [] resolve(final @NonNull Class<?> testClass) {

    final var activeProfiles = splitToList(System.getProperty("spring.profiles.active"));
    final var result = new HashSet<>(activeProfiles);

    return result.stream()
        .flatMap(
            profile -> PROFILE_GROUPS.getOrDefault(profile, List.of(profile)).stream()
        )
        .toArray(String[]::new);
  }

  private List<String> splitToList(final String profiles) {
    var localProfiles = profiles == null ? "local" : profiles;

    return Optional.of(localProfiles)
        .map(it -> it.replaceAll("[;\\s]", ","))
        .map(it -> it.split(","))
        .map(Arrays::asList)
        .orElse(new ArrayList<>());
  }
}
