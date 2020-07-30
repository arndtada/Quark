function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'override-collision': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.Entity',
                'methodName': 'func_213315_a', // move
                'methodDesc': '(Lnet/minecraft/entity/MoverType;Lnet/minecraft/util/math/Vec3d;)V'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                var startInstructions = new InsnList();

                startInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                startInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "recordMotion",
                    "(Lnet/minecraft/entity/Entity;)V",
                    ASM.MethodType.STATIC
                ));
                method.instructions.insertBefore(method.instructions.getFirst(), startInstructions);

                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "net/minecraft/entity/Entity",
                    ASM.mapMethod("func_145775_I"), // doBlockCollisions
                    "()V",
                    function (target) {
                        var newInstructions = new InsnList();

                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 2));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 3));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "applyCollisionLogic",
                            "(Lnet/minecraft/entity/Entity;Lnet/minecraft/util/math/Vec3d;Lnet/minecraft/util/math/Vec3d;)V",
                            ASM.MethodType.STATIC
                        ));
                        method.instructions.insert(target, newInstructions);
                    });
            }
        }
    }
}
